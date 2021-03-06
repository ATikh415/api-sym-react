<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *     normalizationContext={
 *          "groups" = {"customers_read"}
 *     }
 * )
 * @ApiFilter(
 *     SearchFilter::class, properties={"firstname" : "partial", "lastname"}
 * )
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="Le prénom est obligatoire")
     * @Assert\Length(
     *      min = 3,
     *      max = 30,
     *      minMessage = "Le prenom doit contenir plus de 3 caractere",
     *      maxMessage = "Le prenom doit contenir moin de 255 caractere"
     * )
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="L'adresse email est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email est invalide")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customers_read"})
     */
    private $invoices;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\Length(
     *      min = 3,
     *      max = 30,
     *      minMessage = "Le nom de famille doit contenir plus de 3 caractere",
     *      maxMessage = "Le nom de famille doit contenir moin de 255 caractere"
     * )
     */
    private $lastname;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="L'utilisateur est obligatoire")
     */
    private $users;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @Groups({"customers_read"})
     * @return float
     */
    public function getTotalAmount(): float {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice){
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * @Groups({"customers_read"})
     * @return float
     */
    public function getUnpaidAmount(): float {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice){
            return $total + ($invoice->getStatus() === 'PAID' || $invoice->getStatus() === 'CANCELLED' ? 0 : $invoice->getAmount());
        }, 0);
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getUsers(): ?User
    {
        return $this->users;
    }

    public function setUsers(?User $users): self
    {
        $this->users = $users;

        return $this;
    }
}
