import { Owner, Book, User } from "@prisma/client";
import { PureAbility, AbilityBuilder } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";

type AppAbility = PureAbility<
  [
    string,
    Subjects<{
      User: User;
      Book: Book;
      Owner: Owner;
    }>
  ],
  PrismaQuery
>;

export function defineAbility(user: Owner) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  if (user.isAdmin) {
    can("manage", "Book");
    can("manage", "User");
    can("manage", "Owner");
  } else if (user.isChecked) {
    can("read", "Book");
    can("create", "Book");
    can("update", "Book", { ownerId: user.id });
    can("delete", "Book", { ownerId: user.id });
    can("update", "User", { id: user.id });
    can("delete", "User", { id: user.id });
  } else {
    can("read", "Book");
  }

  return build();
}
